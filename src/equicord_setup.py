import subprocess
import os

class NeededStrings:
    temp_upstream_path: str = 'main-repo/temp-upstream/'
    equicord_url: str = 'https://github.com/Equicord/Equicord.git'
    equicord_path: str = 'Equicord/'
    equicord_temp: str = 'main-repo/temp-equicord/'

def setup():
    print('Setup Equicord directory')
    subprocess.run(['mkdir', '-p', f'{NeededStrings.equicord_path}'])

    subprocess.run([
        'git', 'clone',
        '--depth', '1',
        '--single-branch', '--branch', 'main',
        f'{NeededStrings.equicord_url}',
        f'{NeededStrings.equicord_temp}'
    ])

    subprocess.run([
        'rsync', '-a', '--delete',
        '--exclude=\'.git\'', '--exclude=\'node_modules\'',
        f'{NeededStrings.equicord_temp}', f'{NeededStrings.equicord_path}'
    ])

    subprocess.run(['rm', '-rf', f'{NeededStrings.equicord_temp}'])

    print('Update Equicord from upstream')
    subprocess.run([
        'git', 'clone',
        '--depth', '1',
        '--single-branch', '--branch', 'main',
        f'{NeededStrings.equicord_url}',
        f'{NeededStrings.temp_upstream_path}'
    ])

    subprocess.run([
        'rsync', '-a', '--delete',
        '--exclude=\'.git\'', '--exclude=\'node_modules\'',
        f'{NeededStrings.temp_upstream_path}', f'{NeededStrings.equicord_path}'
    ])

    subprocess.run(['rm', '-rf', f'{NeededStrings.temp_upstream_path}'])

setup()