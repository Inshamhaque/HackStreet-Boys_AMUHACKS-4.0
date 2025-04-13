
from dj_rest_auth.registration.views import RegisterView
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Conversation, Message, UserProfile, PillMode
from .serializers import (
    ConversationSerializer, MessageSerializer, UserProfileSerializer,
    ConversationCreateSerializer, MessageCreateSerializer
)
from django.shortcuts import get_object_or_404
from .services.openai_service import generate_ai_response


class CustomRegisterView(RegisterView):
    def perform_create(self, serializer):
        user = super().perform_create(serializer)
        user.first_name = self.request.data.get('first_name', '')
        user.last_name = self.request.data.get('last_name', '')
        user.save()
        return user
    

@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Get the CSRF token needed for making POST requests
    """
    return JsonResponse({'csrfToken': get_token(request)})




class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-updated_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ConversationCreateSerializer
        return ConversationSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        serializer = MessageCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save user message
            user_message = Message.objects.create(
                conversation=conversation,
                role=Message.Role.USER,
                content=serializer.validated_data['content']
            )
            
            # Generate AI response based on pill mode
            response_content = generate_ai_response(
                conversation=conversation,
                user_message=user_message.content,
                pill_mode=conversation.pill_mode,
                language=conversation.language
            )
            
            # Save AI response
            ai_message = Message.objects.create(
                conversation=conversation,
                role=Message.Role.ASSISTANT,
                content=response_content
            )
            
            # Update conversation timestamp
            conversation.save()  # This will update the updated_at field
            
            # Return both messages
            return Response({
                'user_message': MessageSerializer(user_message).data,
                'ai_message': MessageSerializer(ai_message).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def analyze_code(self, request):
        """
        Endpoint for analyzing code snippets without creating a conversation
        """
        code = request.data.get('code', '')
        language = request.data.get('language', 'python')
        pill_mode = request.data.get('pill_mode', PillMode.GREEN)
        
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate pill mode
        if pill_mode not in [choice[0] for choice in PillMode.choices]:
            return Response({"error": "Invalid pill mode"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Call the code analysis service
        from .services.openai_service import analyze_code
        analysis = analyze_code(code, pill_mode, language)
        
        return Response({"analysis": analysis})

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'PUT':
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)



