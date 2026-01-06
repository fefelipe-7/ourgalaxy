from PIL import Image, ImageDraw
import os

# Criar imagem com fundo cinza claro
width, height = 400, 400
img = Image.new('RGB', (width, height), (200, 210, 220))

# Salvar a imagem
os.makedirs('public', exist_ok=True)
img.save('public/welcome-cats.png')
print('Imagem criada: public/welcome-cats.png')
