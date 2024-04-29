# authentication/views.py

from django.http import JsonResponse
import requests
import os

def discord_callback(request):
    error = request.GET.get('error')
    code = request.GET.get('code')
    
    if error:
        return JsonResponse({'error': error}, status=400)
    
    if code:
        client_id = os.getenv('DISCORD_CLIENT_ID')
        client_secret = os.getenv('DISCORD_CLIENT_SECRET')
        redirect_uri = 'http://localhost:8000/auth/callback/discord/'  # Ensure this matches your registered URI
        
        # Exchange the code for a token
        token_response = requests.post(
            'https://discord.com/api/oauth2/token',
            data={
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri,
            },
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        )
        
        if token_response.status_code == 200:
            access_token = token_response.json().get('access_token')
            # You can now use this access token to make authenticated requests to the Discord API
            
            # For example, fetch user profile
            user_response = requests.get(
                'https://discord.com/api/users/@me',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            
            if user_response.status_code == 200:
                user_info = user_response.json()
                return JsonResponse(user_info, safe=False)
            else:
                return JsonResponse({'error': 'Failed to fetch user info'}, status=500)
        else:
            return JsonResponse({'error': 'Failed to exchange code for token'}, status=token_response.status_code)
    
    return JsonResponse({'error': 'No code provided'}, status=400)
