# https://docs.wand-py.org/en/0.6.7/

from wand.image import Image

def main():
    icon_sizes = [16, 24, 32, 48, 128]

    with Image(filename='logo-512.png') as img:
        for size in icon_sizes:
            with img.clone() as i:
                i.resize(size, size)
                print(i.size)
                i.save(filename='icons/icon-{0}.png'.format(size))

if __name__ == '__main__':
    main()