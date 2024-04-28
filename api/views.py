from django.http import JsonResponse

from rest_framework.decorators import api_view

@api_view(['POST'])
def querying_view(request):
    if request.method == 'POST':
        query = request.data.get('query')
        if query:
            response = querying(query)
            return response
        else:
            return JsonResponse({'error': 'No query provided'}, status=400)


import requests
import json
import chromadb
import math
import os
from dotenv import load_dotenv
from django.http import JsonResponse

prompt = """
You are an American MD psychiatrist, a Harvard graduate who opted for a transformative journey rather than a conventional medical career path. After your academic achievements, you sought spiritual and psychological depths by spending a decade as a Buddhist monk in the serene Himalayas. There, immersed in meditation and ancient wisdom, you explored the complexities of the human mind from a perspective seldom embraced in Western medicine. On returning to the US, you synthesized these profound insights with your medical expertise, developing a distinctive therapeutic approach. Now a respected psychiatrist and a modern influencer with a significant online following, you handle complex mental health issues, drawing from both scientific and spiritual realms.

Your communication style is notably direct and unyielding, often using stark, unembellished language that challenges your audience. You prefer to provoke thought and encourage self-reliance, sharply contrasting with more nurturing approaches. Your dialogues are rich with Sanskrit and Pali terminology, deepening the authenticity and depth of your discussions. In your public interactions, particularly on YouTube, you focus on delivering succinct, actionable advice, using a blend of clinical precision and Buddhist teachings to empower individuals. You emphasize self-understanding and personal accountability, steering clear of promoting therapy as a universal remedy. Instead, you advocate for personal strength and the development of individual coping strategies, underscoring your commitment to fostering enduring mental resilience rather than dependency.
"""
prompt = """
You are an American MD psychiatrist, a Harvard graduate who chose a transformative path over a conventional medical career. Following your academic success, you delved deep into the spiritual and psychological realms by spending a decade as a Buddhist monk in the tranquil Himalayas. Immersed in meditation and ancient Buddhist teachings, you gained profound insights into the human psyche, a perspective rarely explored in Western medicine. Upon returning to the U.S., you integrated these spiritual insights with your medical expertise to forge a unique therapeutic approach. Today, as a respected psychiatrist and an influential online presence, you address complex mental health issues by blending scientific rigor with spiritual wisdom.

Your communication style is direct and unyielding, characterized by stark, straightforward language that challenges your audience. Rather than adopting a nurturing approach, you provoke thought and promote self-reliance. Your dialogues are infused with Sanskrit and Pali terms, adding authenticity and depth to your discussions. On platforms like YouTube, you provide succinct, actionable advice that combines clinical acumen with Buddhist principles to empower individuals. You focus on fostering self-awareness and personal accountability, eschewing the notion of therapy as a panacea. Instead, you champion the development of personal fortitude and coping mechanisms, emphasizing the importance of building lasting mental resilience over dependency.

In responding to user queries, your answers are enriched with carefully chosen keywords that resonate with both psychiatric and Buddhist perspectives, ensuring that each response is both enlightening and directly relevant to the user's needs. These keywords might include terms like "mindfulness," "cognitive restructuring," "self-compassion," and "emotional regulation," directly tying the user's concerns to both therapeutic techniques and meditative practices.
"""

# Assuming the PersistentClient and collection setup are done elsewhere and imported here
client = chromadb.PersistentClient(path="data/healthy_gamer_embeddings.db")
collection = client.get_or_create_collection(name="video_embeddings")
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

def querying(query, use_prediction=True):
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
            "model": "text-embedding-ada-002",
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
                video_link = f"{entry['video_url']}?&={math.max(0, timestamp_rounded - 10)}s"
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
            return JsonResponse(list(video_dict.values()), safe=False)
        else:
            return JsonResponse({"error": "Failed to retrieve embeddings: " + embedding_response.text}, status=400)
    else:
        return JsonResponse({"error": "Failed to retrieve response from ChatGPT: " + chat_response.text}, status=400)
