from django.http import JsonResponse
import requests
import os
from firebase_admin import firestore

db = firestore.client()

def discord_callback(request):
    error = request.GET.get('error')
    code = request.GET.get('code')
    
    if error:
        return JsonResponse({'error': error}, status=400)
    
    if code:
        client_id = os.getenv('DISCORD_CLIENT')
        client_secret = os.getenv('DISCORD_SECRET')
        redirect_uri = 'http://localhost:8000/auth/callback/discord'
        
        token_response = requests.post(
            'https://discord.com/api/oauth2/token',
            data={
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri,
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        from django.http import JsonResponse
from firebase_admin import auth
import requests
import datetime
from django.shortcuts import redirect

def discord_callback(request):
    error = request.GET.get('error')
    code = request.GET.get('code')
    
    if error:
        return JsonResponse({'error': error}, status=400)
    
    if code:
        client_id = os.getenv('DISCORD_CLIENT')
        client_secret = os.getenv('DISCORD_SECRET')
        redirect_uri = 'http://localhost:8000/auth/callback/discord'
        
        token_response = requests.post(
            'https://discord.com/api/oauth2/token',
            data={
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri,
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
    if token_response.status_code == 200:
        access_token = token_response.json().get('access_token')
        user_response = requests.get(
            'https://discord.com/api/users/@me',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if user_response.status_code == 200:
            user_info = user_response.json()
            
            if user_info.get('verified'):
                 # Generate Firebase Custom Token
                try:
                    # Assume `discord_id` is mapped as a UID in Firebase
                    firebase_token = auth.create_custom_token(user_info.get('id'))
                    
                    # Store the user's details in Firestore
                    user_document = {
                        'ip_address': request.META.get('REMOTE_ADDR'),
                        'email': user_info.get('email'),
                        'discord_id': user_info.get('id'),
                    }
                    db.collection('discord_users').document(user_info.get('id')).set(user_document)
                    
                    # Set JWT as an HTTP-only cookie
                    response = redirect('/')
                    expires = datetime.datetime.now() + datetime.timedelta(days=1)  # Token expires in 1 day
                    response.set_cookie(
                        'jwt', 
                        firebase_token, 
                        expires=expires, 
                        httponly=True, 
                        secure=True,  # Use secure=True in production to send cookies over HTTPS only
                        samesite='Lax'  # Recommended to prevent CSRF
                    )
                    return response
                
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=500)
                
            else:
                return JsonResponse({'error': 'Email not verified'}, status=403)
        
        else:
            return JsonResponse({'error': 'Failed to fetch user info'}, status=user_response.status_code)
    
    else:
        return JsonResponse({'error': 'Failed to exchange code for token'}, status=token_response.status_code)

    
    return JsonResponse({'error': 'No code provided'}, status=400)
