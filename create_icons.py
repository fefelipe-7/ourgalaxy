from PIL import Image
import os

# Abrir a imagem
img = Image.open('favicon.png')

# Redimensionar para diferentes tamanhos
sizes = {
    'favicon.png': (32, 32),
    'public/favicon.png': (32, 32),
}

for filename, size in sizes.items():
    os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
    resized = img.resize(size, Image.Resampling.LANCZOS)
    resized.save(filename)
    print(f'Criado: {filename} ({size[0]}x{size[1]})')

print('Ícones criados com sucesso!')
