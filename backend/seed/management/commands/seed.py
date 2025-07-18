import json

from django.core.management.base import BaseCommand

from jobs.models import Expertise
from user.models import Skill, Title


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        # parser.add_argument("poll_ids", nargs="+", type=int)
        pass

    def handle(self, *args, **options):
        with open("./seed/management/commands/seeds/skills.json", "r") as f:
            skills = json.load(f)
        for skill in skills:
            Skill.objects.create(name=skill)

        with open("./seed/management/commands/seeds/titles.json", "r") as f:
            titles = json.load(f)
        for title in titles:
            Title.objects.create(name=title)

        with open("./seed/management/commands/seeds/expertise.json", "r") as f:
            expertise = json.load(f)
        for exp in expertise:
            Expertise.objects.create(name=exp)
