import string
import random
import subprocess

random_letters = ""

# Generate 5 Random Uppercase letters
for i in range(8):
    random_letter = random.choice(string.ascii_letters)
    random_letters += random_letter

subprocess.run(
    f'echo "RELEASE_VERSION=\'{random_letters}\'" >> $GITHUB_ENV',
    shell = True
)