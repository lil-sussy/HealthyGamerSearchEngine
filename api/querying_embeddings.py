import logging
import os
from dotenv import load_dotenv
from django.http import JsonResponse
import requests
import chromadb
import math
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
import nltk
from pytube import YouTube
import colorlog

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

handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Change this to DEBUG if you want to see debug logs
logger.addHandler(handler)

# Disable propagation to prevent double logging in Django
logger.propagate = False

# Load environment variables
load_dotenv()



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
remote_client = chromadb.HttpClient(host=os.getenv("CHROMA_SERVER_URL"), port=os.getenv("CHROMA_SERVER_PORT"), ssl=(os.getenv("CHROMA_SERVER_PORT") == '443'))
collection = remote_client.get_or_create_collection(name="video_embeddings")
api_key = os.getenv('OPENAI_API_KEY')



def get_video_duration(video_url):
    try:
        logger.info(f"Fetching video duration for URL: {video_url}")
        yt = YouTube(video_url)
        duration = yt.length
        logger.info(f"Video duration: {duration} seconds")
        return duration
    except Exception as e:
          logger.error(f"Error fetching video duration: {e}")
          return None

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
import nltk
from nltk.corpus import wordnet


nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
def query_pre_processing(query):
    logger.info(f"{WHITE}Pre-processing query: {BLUE}{ITALIC}{query}{RESET}")
    try:
        # Tokenization
        tokens = word_tokenize(query.lower())
        # Stopword Removal
        stop_words = set(stopwords.words('english'))
        tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
        # Stemming
        stemmer = PorterStemmer()
        tokens = [stemmer.stem(word) for word in tokens]
        # Lemmatization
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(word) for word in tokens]
        processed_query = ' '.join(tokens)
        logger.info(f"{WHITE}Processed query: {BLUE}{ITALIC}{processed_query}{RESET}")
        return processed_query
    except Exception as e:
        logger.error(f"Error in query pre-processing: {e}")
        return query

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
import requests
# remote_client = chromadb.HttpClient(host="chroma-gprs-production.up.railway.app", port=port, ssl=True)

# remote_client.delete_collection(name="video_embeddings")
# local_client.delete_collection(name="video_embeddings")
collection_embeddings = remote_client.get_or_create_collection(name="keywords_embeddings")

def get_embeddings_openai(texts):
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    url = "https://api.openai.com/v1/embeddings"
    payload = {
        "input": texts,
        "model": "text-embedding-3-small"
    }
    try:
        logger.info(f"{WHITE}Requesting embeddings for texts: {BLUE}{ITALIC}{texts}{RESET}")
        return requests.post(url, headers=headers, json=payload).json()['data'][0]['embedding']
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching embeddings from OpenAI: {e}")
        return None

import yake

def extract_keywords(text, max_ngram_size=3, num_of_keywords=5):
    kw_extractor = yake.KeywordExtractor(n=max_ngram_size, top=num_of_keywords, dedupLim=0.9)
    keywords = kw_extractor.extract_keywords(text)
    return [keyword for keyword, score in keywords]

def enhance_query_keywords(query):
    logger.info(f"Enhancing query with keywords: {query}")
    try:
        # Extract keywords from the query
        query_keywords = extract_keywords(query, num_of_keywords=max(0.3*len(query.split(" ")), 8))
        # Generate embeddings for each query keyword
        embeddings = {keyword: get_embeddings_openai(keyword) for keyword in query_keywords}
        enhanced_keywords = {}
        for keyword, embedding in embeddings.items():
            # Find similar keywords in the collection using the embedding
            results = collection_embeddings.query(query_embeddings=[embedding], n_results=5)
            similar_keywords = results['documents'][0]  # Assume results are structured with documents containing the keywords
            # Add similar keywords to the set
            enhanced_keywords[keyword] = set(similar_keywords)
        # Replace each keyword in the original query with the augmented keywords
        enhanced_query = []
        for word in query.split():
            if word in enhanced_keywords:
                # Replace the word with the original and similar keywords
                augmented_keywords = ' '.join(enhanced_keywords[word])
                enhanced_query.append(f"{word} {augmented_keywords}")
            else:
                enhanced_query.append(word)
        enhanced_query_str = ' '.join(enhanced_query)
        logger.info(f"Enhanced query: {enhanced_query_str}")
        return enhanced_query_str
    except Exception as e:
        logger.error(f"Error enhancing query keywords: {e}")
        return query


def querying(query, use_prediction=True):
    logger.info(f"{WHITE}Querying AI with query: {BLUE}{ITALIC}{query}{RESET}")
    try:
        pre_processed_query = query_pre_processing(query)
        enhanced_query = enhance_query_keywords(pre_processed_query)
      
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
                    "content": enhanced_query
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
                    duration = get_video_duration(entry['video_url'])
                    video_id = entry['video_url'].split('=')[-1]
                    timestamp_rounded = math.floor(entry['timestamp'])
                    video_link = f"{entry['video_url']}?&={max(0, timestamp_rounded - 10)}s"
                    if video_id not in video_dict:
                        video_dict[video_id] = {
                            'video_id': video_id,
                            'duration': duration,
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
                logger.info(f"Querying AI result length: {len(video_dict.values())}")
                return list(video_dict.values()), chat_text
            else:
                return JsonResponse({"error": "Failed to retrieve embeddings: " + embedding_response.text}, status=400)
        else:
            return JsonResponse({"error": "Failed to retrieve response from ChatGPT: " + chat_response.text}, status=400)
    except requests.exceptions.RequestException as e:
        logger.error(f"Network request failed: {e}")
        return JsonResponse({"error": f"Failed to retrieve response: {e}"}, status=400)
    except Exception as e:
        logger.error(f"Error querying AI: {e}")
        return JsonResponse({"error": f"An unexpected error occurred: {e}"}, status=500)
