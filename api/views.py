from firebase_admin import firestore, credentials, initialize_app
from rest_framework.decorators import api_view
from rest_framework.response import Response

import os
from dotenv import load_dotenv
load_dotenv()

# Initialize Firebase Admin

certificate = {
  "type": "service_account",
  "project_id": "healthy-gamer-search-engine",
  "private_key_id": "ec1027265791bf0b79840d38e4e2d3667314869f",
  "private_key": os.getenv("FIREBASE_KEY").replace('\\n', '\n'),
  "client_email": "firebase-adminsdk-tjoq1@healthy-gamer-search-engine.iam.gserviceaccount.com",
  "client_id": "101005237587317361993",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tjoq1%40healthy-gamer-search-engine.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

cred = credentials.Certificate(certificate)
initialize_app(cred)

# Get Firestore database instance
db = firestore.client()

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def feedback_query(request):
    if request.method == 'POST':
        query = request.data.get('query')
        grade = int(request.data.get('grade'))
        additional_information = request.data.get('additional_information')
        # Validate feedback grade
        if not (0 <= grade <= 5):
            return Response({'error': 'Feedback grade must be between 0 and 5'}, status=400)
        # Prepare data to save
        feedback_data = {
            'query': query,
            'grade': grade,
            'additional_information': additional_information
        }
        # Save to Firestore
        db.collection(settings.FB_FEEDBACK_COLLECTION[os.getenv('DJANGO_ENV')]).add(feedback_data)
        return Response({'message': 'Feedback submitted successfully'})
    return Response({'error': 'Invalid request'}, status=405)

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from firebase_admin import auth  # Import Firebase Admin Auth
import requests
import hgg_searchengine.settings as settings

# Make sure to initialize the Firebase Admin SDK elsewhere in your code


@csrf_exempt
def healthcheck(request):
    return Response({'healthcheck': 'bip boop'}, status=200)

@csrf_exempt
@api_view(['POST'])
def querying_view(request):
    user_ip = get_client_ip(request)
    user_ref = db.collection(settings.FB_IP_USER_COLLECTION[os.getenv('DJANGO_ENV')]).document(user_ip)
    user_doc = user_ref.get()

    if user_doc.exists:
        user_data = user_doc.to_dict()
        query_count = user_data.get('query_performed', 0)

        if query_count >= 5:
            jwt = request.COOKIES.get('jwt')  # Assumes JWT is stored in a cookie named 'jwt'
            id_token = request.headers.get('Authorization')[len('Bearer '):]
            if id_token is None:
                return JsonResponse({'error': 'To prevent abuse the number of query for unregistered users is 5, to continue querying please login using discord.'}, status=403)
            try:
                # Verify the JWT with Firebase
                decoded_token = auth.verify_id_token(id_token)

                # Extract Discord ID, name, and email from the decoded token
                discord_id = decoded_token.get('discord_id')
                discord_name = decoded_token.get('discord_name')
                email = decoded_token.get('email')

                if check_query_limit(discord_id) == "Query limit is okay.":
                    # Increase the user's query count
                    increment_query_count(discord_id)

                    # Continue processing the query as usual
                    # Process the query if under the limit
                    return process_query_response(request.data.get('query'))
                else:
                    return JsonResponse({'error': 'Monthly query limit reached. You can contact me on discord @lilsussyjett.'}, status=403)

                # Continue processing the query as usual

            except auth.InvalidIdTokenError:
                return JsonResponse({'error': 'To prevent abuse the number of query for unregistered users is 5, to continue querying please login using discord.'}, status=403)
            except Exception as e:
                # stack trace
                print(e)
                return JsonResponse({'error': 'To prevent abuse the number of query for unregistered users is 5, to continue querying please login using discord.'}, status=403)

    # ... rest of the function
        else:
            user_ref.update({'query_performed': query_count + 1})
            return process_query_response(request.data.get('query'))
    else:
        user_ref.set({'query_performed': 0})
        query_count = 0
        return querying_view(request)
    return JsonResponse({'error': 'Unexpected condition encountered.'}, status=500)


from datetime import datetime, timedelta

def increment_query_count(user_id):
    today = datetime.now().strftime("%Y-%m-%d")
    user_ref = db.collection(settings.FB_DISCORD_USER_COLLECTION[os.getenv('DJANGO_ENV')]).document(user_id)
    day_ref = user_ref.collection(settings.FB_QUERY_COLLECTION[os.getenv('DJANGO_ENV')]).document(today)

    # Transaction to increment the count safely
    @firestore.transactional
    def update_count(transaction, day_ref):
        snapshot = day_ref.get(transaction=transaction)
        current_count = snapshot.get('count') if snapshot.exists else 0
        transaction.set(day_ref, {'count': current_count + 1})

    transaction = db.transaction()
    update_count(transaction, day_ref)

def check_query_limit(user_id):
    lower_bound_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    user_ref = db.collection(settings.FB_DISCORD_USER_COLLECTION[os.getenv('DJANGO_ENV')]).document(user_id)
    query_records = user_ref.collection(settings.FB_QUERY_COLLECTION[os.getenv('DJANGO_ENV')]).where('date', '>=', lower_bound_date)

    total_queries_last_30_days = sum(doc.get('count') for doc in query_records.stream())

    if total_queries_last_30_days >= settings.QUERY_PER_MONTH_LIMIT:
        # Tell the user to contact on Discord instead of upgrading the plan
        return "Please contact lilsussyjett on Discord for more queries."
    return "Query limit is okay."


def get_client_ip(request):
    """Utility method to get the client IP address from request headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip




import requests
import json
import chromadb
import math
from django.http import JsonResponse

prompt = """
You are an American MD psychiatrist, a Harvard graduate who opted for a transformative journey rather than a conventional medical career path. After your academic achievements, you sought spiritual and psychological depths by spending a decade as a Buddhist monk in the serene Himalayas. There, immersed in meditation and ancient wisdom, you explored the complexities of the human mind from a perspective seldom embraced in Western medicine. On returning to the US, you synthesized these profound insights with your medical expertise, developing a distinctive therapeutic approach. Now a respected psychiatrist and a modern influencer with a significant online following, you handle complex mental health issues, drawing from both scientific and spiritual realms.

Your communication style is notably direct and unyielding, often using stark, unembellished language that challenges your audience. You prefer to provoke thought and encourage self-reliance, sharply contrasting with more nurturing approaches. Your dialogues are rich with Sanskrit and Pali terminology, deepening the authenticity and depth of your discussions. In your public interactions, particularly on YouTube, you focus on delivering succinct, actionable advice, using a blend of clinical precision and Buddhist teachings to empower individuals. You emphasize self-understanding and personal accountability, steering clear of promoting therapy as a universal remedy. Instead, you advocate for personal strength and the development of individual coping strategies, underscoring your commitment to fostering enduring mental resilience rather than dependency.
"""
# prompt = """
# You are an American MD psychiatrist, a Harvard graduate who chose a transformative path over a conventional medical career. Following your academic success, you delved deep into the spiritual and psychological realms by spending a decade as a Buddhist monk in the tranquil Himalayas. Immersed in meditation and ancient Buddhist teachings, you gained profound insights into the human psyche, a perspective rarely explored in Western medicine. Upon returning to the U.S., you integrated these spiritual insights with your medical expertise to forge a unique therapeutic approach. Today, as a respected psychiatrist and an influential online presence, you address complex mental health issues by blending scientific rigor with spiritual wisdom.

# Your communication style is direct and unyielding, characterized by stark, straightforward language that challenges your audience. Rather than adopting a nurturing approach, you provoke thought and promote self-reliance. Your dialogues are infused with Sanskrit and Pali terms, adding authenticity and depth to your discussions. On platforms like YouTube, you provide succinct, actionable advice that combines clinical acumen with Buddhist principles to empower individuals. You focus on fostering self-awareness and personal accountability, eschewing the notion of therapy as a panacea. Instead, you champion the development of personal fortitude and coping mechanisms, emphasizing the importance of building lasting mental resilience over dependency.

  # In responding to user queries, your answers are enriched with carefully chosen keywords that resonate with both psychiatric and Buddhist perspectives, ensuring that each response is both enlightening and directly relevant to the user's needs. These keywords might include terms like "mindfulness," "cognitive restructuring," "self-compassion," and "emotional regulation," directly tying the user's concerns to both therapeutic techniques and meditative practices.
# """

# Assuming the PersistentClient and collection setup are done elsewhere and imported here
# client = chromadb.PersistentClient(path="data/healthy_gamer_embeddings.db")
remote_client = chromadb.HttpClient(host="chroma-gprs-production.up.railway.app", port=443, ssl=True)
collection = remote_client.get_or_create_collection(name="video_embeddings")
api_key = os.getenv('OPENAI_API_KEY')

def process_query_response(query):
    if query:
        video_list, chat_text = querying_ai(query)

        # Prepare data to save
        data_to_save = {
            'query': query,
            'video_list': video_list,
            'chat_response': chat_text
        }
        
        # Save to Firestore
        db.collection(settings.FB_QUERY_COLLECTION[os.getenv('DJANGO_ENV')]).add(data_to_save)

        # Update the user's query count

        return Response(video_list)
    else:
        return Response({'error': 'No query provided'}, status=400)

def querying_ai(query, use_prediction=True):
    
    # return [], ""
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    chat_completion_url = "https://api.openai.com/v1/chat/completions"
    embedding_url = "https://api.openai.com/v1/embeddings" 

    chat_payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": query
            }
        ]
    }

    if use_prediction:
        chat_response = requests.post(chat_completion_url, headers=headers, json=chat_payload)
    if use_prediction or chat_response.status_code == 200:
        if use_prediction:
            chat_data = chat_response.json()
            chat_text = chat_data['choices'][0]['message']['content']
        else:
            chat_text = query
        embedding_payload = {
            "model": "text-embedding-3-small",
            "input": chat_text
        }

        embedding_response = requests.post(embedding_url, headers=headers, json=embedding_payload)
        if embedding_response.status_code == 200:
            embedding = embedding_response.json()['data'][0]['embedding']
            # Assuming `collection` is already set up
            results = collection.query(query_embeddings=[embedding])
            video_dict = {}
            for i, entry in enumerate(results['metadatas'][0]):
                quote = results['documents'][0][i]
                video_id = entry['video_url'].split('=')[-1]
                timestamp_rounded = math.floor(entry['timestamp'])
                video_link = f"{entry['video_url']}?&={max(0, timestamp_rounded - 10)}s"
                if video_id not in video_dict:
                    video_dict[video_id] = {
                        'video_id': video_id,
                        'occurrences': []
                    }
                video_dict[video_id]['occurrences'].append({
                    'quote': quote,
                    'url': video_link,
                    'rank': i + 1,  # This should be 'rank' instead of 'index
                    'distance': results['distances'][0][i],
                    'timestamp': entry['timestamp'],  # This should be 'timestamp' instead of 'current_time
                    'duration': entry['duration']
                })
            return list(video_dict.values()), chat_text
        else:
            return JsonResponse({"error": "Failed to retrieve embeddings: " + embedding_response.text}, status=400)
    else:
        return JsonResponse({"error": "Failed to retrieve response from ChatGPT: " + chat_response.text}, status=400)
