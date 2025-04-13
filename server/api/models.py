from django.db import models
from django.contrib.auth.models import User

class PillMode(models.TextChoices):
    GREEN = 'green', 'Green Pill (Beginner)'
    BLUE = 'blue', 'Blue Pill (Intermediate)'
    RED = 'red', 'Red Pill (Advanced)'

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pill_mode = models.CharField(
        max_length=10,
        choices=PillMode.choices,
        default=PillMode.GREEN
    )
    language = models.CharField(max_length=50, default='python')
    
    def __str__(self):
        return f"{self.title or 'Untitled'} - {self.user.username}"

class Message(models.Model):
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'Assistant'
        SYSTEM = 'system', 'System'
    
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=Role.choices)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferred_pill_mode = models.CharField(
        max_length=10,
        choices=PillMode.choices,
        default=PillMode.GREEN
    )
    preferred_language = models.CharField(max_length=50, default='python')
    
    def __str__(self):
        return self.user.username