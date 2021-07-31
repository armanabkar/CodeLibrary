from django.db import models

from django.contrib.auth import get_user_model


class Code(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
