import logging
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from firebase_admin import firestore, credentials, initialize_app, auth
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import requests
import hgg_searchengine.settings as settings
import logging
import colorlog

from api.querying_embeddings import querying


# ANSI escape sequences
WHITE = "\033[97m"
BLUE = "\033[94m"
ITALIC = "\033[3m"
RESET = "\033[0m"

# Configure logging with colorlog
formatter = colorlog.ColoredFormatter(
    "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt='%Y-%m-%d %H:%M:%S',
    log_colors={
        'DEBUG': 'bold_blue',
        'INFO': 'bold_green',
        'WARNING': 'bold_yellow',
        'ERROR': 'bold_red',
        'CRITICAL': 'bold_red,bg_white',
    }
)
import os

DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'
logger = logging.getLogger(__name__)
logger.info(f'DJANGO_DEBUG is set to: {DEBUG}')

logger = logging.getLogger('django')

logger.debug("Debug level log")
logger.info("Info level log")
logger.warning("Warning level log")
logger.error("Error level log")
logger.critical("Critical level log")


handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Change this to DEBUG if you want to see debug logs
logger.addHandler(handler)

# Disable propagation to prevent double logging in Django
logger.propagate = False

# Load environment variables
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
logger.info("Firebase Admin initialized.")

# Get Firestore database instance
db = firestore.client()

@csrf_exempt
@api_view(['POST'])
def feedback_query(request):
    if request.method == 'POST':
        query = request.data.get('query')
        grade = int(request.data.get('grade'))
        additional_information = request.data.get('additional_information')
        # Validate feedback grade
        if not (0 <= grade <= 5):
            logger.error(f"Invalid feedback grade: {grade}")
            return Response({'error': 'Feedback grade must be between 0 and 5'}, status=400)
        # Prepare data to save
        feedback_data = {
            'query': query,
            'grade': grade,
            'additional_information': additional_information
        }
        # Save to Firestore
        logger.info(f"Saving feedback: {feedback_data}")
        db.collection(settings.FB_FEEDBACK_COLLECTION[os.getenv('DJANGO_ENV')]).add(feedback_data)
        logger.info("Feedback submitted successfully.")
        return Response({'message': 'Feedback submitted successfully'})
    logger.error("Invalid request method.")
    return Response({'error': 'Invalid request'}, status=405)

@csrf_exempt
def healthcheck(request):
    logger.info("Healthcheck endpoint called.")
    return Response({'healthcheck': 'bip boop'}, status=200)

@csrf_exempt
@api_view(['POST'])
def querying_view(request):
    try:
        logger.info("Querying view called.")
        user_ip = get_client_ip(request)
        logger.info(f"{WHITE}Client IP: {BLUE}{ITALIC}{user_ip}{RESET}")
        user_ref = db.collection(settings.FB_IP_USER_COLLECTION[os.getenv('DJANGO_ENV')]).document(user_ip)
        user_doc = user_ref.get()

        if user_doc.exists:
            user_data = user_doc.to_dict()
            query_count = user_data.get('query_performed', 0)
            logger.info(f"{WHITE}User query count: {BLUE}{ITALIC}{query_count}{RESET}")

            if query_count >= settings.QUERY_LIMIT:
                jwt = request.COOKIES.get('jwt')  # Assumes JWT is stored in a cookie named 'jwt'
                id_token = request.headers.get('Authorization')[len('Bearer '):]
                if id_token is None:
                    logger.warning("No JWT provided.")
                    return JsonResponse({'error': f'To prevent abuse the number of query for unregistered users is {settings.QUERY_LIMIT}, to continue querying please login using discord.'}, status=403)
                try:
                    # Verify the JWT with Firebase
                    decoded_token = auth.verify_id_token(id_token)

                    # Extract Discord ID, name, and email from the decoded token
                    discord_id = decoded_token.get('discord_id')
                    discord_name = decoded_token.get('discord_name')
                    email = decoded_token.get('email')
                    logger.info(f"{WHITE}Decoded token for Discord user: {BLUE}{ITALIC}{discord_name} ({discord_id}){RESET}")

                    if check_query_limit(discord_id) == "Query limit is okay.":
                        # Increase the user's query count
                        increment_query_count(discord_id)
                        # Process the query if under the limit
                        return process_query_response(request.data.get('query'))
                    else:
                        return JsonResponse({'error': 'Monthly query limit reached. You can contact me on discord @lilsussyjett.'}, status=403)

                    # Continue processing the query as usual

                except auth.InvalidIdTokenError:
                    logger.error("Invalid JWT.")
                    return JsonResponse({'error': 'To prevent abuse the number of query for unregistered users is 5, to continue querying please login using discord.'}, status=403)
                except Exception as e:
                    logger.error(f"Error processing JWT: {e}")
                    return JsonResponse({'error': 'To prevent abuse the number of query for unregistered users is 5, to continue querying please login using discord.'}, status=403)
            else:
                user_ref.update({'query_performed': query_count + 1})
                return process_query_response(request.data.get('query'))
        else:
            user_ref.set({'query_performed': 1})
            return process_query_response(request.data.get('query'))
    except requests.exceptions.RequestException as e:
        logger.error(f"Network request failed: {e}")
        return JsonResponse({'error': 'Failed to process query due to a network error.'}, status=500)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

from datetime import datetime, timedelta

def increment_query_count(user_id):
    logger.info(f"{WHITE}Incrementing query count for user: {BLUE}{ITALIC}{user_id}{RESET}")
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
    logger.info("Query count incremented successfully.")

def check_query_limit(user_id):
    logger.info(f"{WHITE}Checking query limit for user: {BLUE}{ITALIC}{user_id}{RESET}")
    lower_bound_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    user_ref = db.collection(settings.FB_DISCORD_USER_COLLECTION[os.getenv('DJANGO_ENV')]).document(user_id)
    query_records = user_ref.collection(settings.FB_QUERY_COLLECTION[os.getenv('DJANGO_ENV')]).where('date', '>=', lower_bound_date)

    total_queries_last_30_days = sum(doc.get('count') for doc in query_records.stream())
    logger.info(f"{WHITE}Total queries in the last 30 days: {BLUE}{ITALIC}{total_queries_last_30_days}{RESET}")

    if total_queries_last_30_days >= settings.QUERY_PER_MONTH_LIMIT:
        # Tell the user to contact on Discord instead of upgrading the plan
        logger.warning("Query limit reached.")
        return "Please contact @lilsussyjett on Discord for more queries."
    return "Query limit is okay."


def get_client_ip(request):
    """Utility method to get the client IP address from request headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    logger.info(f"{WHITE}Client IP retrieved: {BLUE}{ITALIC}{ip}{RESET}")
    return ip

def process_query_response(query):
    if query:
        logger.info(f"{WHITE}Processing query: {BLUE}{ITALIC}{query}{RESET}")
        video_list, chat_text = querying(query)
        data_to_save = {
            'query': query,
            'video_list': video_list,
            'chat_response': chat_text
        }
        db.collection(settings.FB_QUERY_COLLECTION[os.getenv('DJANGO_ENV')]).add(data_to_save)
        logger.info("Query response saved to Firestore.")
        return Response(video_list)
    else:
        logger.error("No query provided.")
        return Response({'error': 'No query provided'}, status=400)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
import json
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re

@csrf_exempt
def feedback_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return JsonResponse({'error': 'Please enter a valid email address.'}, status=400)

        # Here you can handle the message, for example, sending an email
        try:
            send_mail(
                f'Feedback from {name}',
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'success': 'Thank you for your feedback!'})

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
