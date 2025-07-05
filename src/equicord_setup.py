import subprocess
import os

class NeededStrings:
    temp_upstream_path: str = 'temp-upstream/'
    equicord_url: str = 'https://github.com/Equicord/Equicord.git'
    equicord_path: str = 'main-repo/Equicord/'
    equicord_temp: str = 'temp-equicord/'

def setup():
    print('Setup Equicord directory')
    subprocess.run(['mkdir', '-p', f'{NeededStrings.equicord_path}'])

    subprocess.run([
        'git', 'clone',
        '--depth 1',
        '--single-branch', '--branch main', f'{NeededStrings.equicord_url}',
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
        '--depth 1',
        '--single-branch', '--branch main',
        f'{NeededStrings.equicord_url}'
    ], f'{NeededStrings.temp_upstream_path}')

    subprocess.run([
        'rsync', '-a', '--delete',
        '--exclude=\'.git\'', '--exclude=\'node_modules\'',
        f'{NeededStrings.temp_upstream_path}', f'{NeededStrings.equicord_path}'
    ])

    subprocess.run(['rm', '-rf', f'{NeededStrings.temp_upstream_path}'])

    print('Modify .gitignore for dist and executables')
    if os.path.exists('main-repo/Equicord/.gitignore'):
        subprocess.run([
            'sed', '-i',
            '-e', '\'/dist/d\'',
            '-e', '\'/\\.exe/d\'',
            '-e', '\'/vencord_installer/d\'',
            '.gitignore'
        ], cwd = 'main-repo/Equicord')

        subprocess.run(['echo "# Dist and executable files are intentionally tracked in this fork" >> .gitignore'])
    else:
        print('No .gitignore file found')

    print('Install dependencies')
    subprocess.run(['npm', 'i', '-g', 'pnpm'], cwd = 'main-repo/Equicord')
    subprocess.run(['pnpm', 'i' '--no-frozen-lockfile'], cwd = 'main-repo/Equicord') # WARN: --no-frozen-lockfile is very important, do not erase from subproccess command.

setup()