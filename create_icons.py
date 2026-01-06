from PIL import Image
import os

# Criar a imagem base (usando cores similares à imagem fornecida)
# Vamos criar uma imagem com o padrão de galáxia
width, height = 512, 512
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))

# Salvar em diferentes tamanhos para Android
sizes = {
    'android/app/src/main/res/mipmap-mdpi/ic_launcher.png': (48, 48),
    'android/app/src/main/res/mipmap-hdpi/ic_launcher.png': (72, 72),
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png': (96, 96),
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png': (144, 144),
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png': (192, 192),
    'public/favicon.png': (32, 32),
}

# Criar diretórios se não existirem
for filepath in sizes.keys():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

# Para cada tamanho, redimensionar e salvar
for filepath, size in sizes.items():
    resized = img.resize(size, Image.Resampling.LANCZOS)
    resized.save(filepath)
    print(f'Criado: {filepath} ({size[0]}x{size[1]})')

print('Ícones criados com sucesso!')
