# Generated by Django 4.1.7 on 2023-04-07 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AI_text_detector', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lm_script',
            name='script',
            field=models.CharField(max_length=200),
        ),
    ]
