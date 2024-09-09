from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage

class CustomStorage(S3Boto3Storage):
    pass
    # def _save(self, name, content):
    #     # Check if the file is an image
    #     if name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
    #         # Use S3 storage for images
    #         s3_storage = S3Boto3Storage()
    #         return s3_storage.save(name, content)
    #     else:
    #         # Use local filesystem storage for other files
    #         return super()._save(name, content)
