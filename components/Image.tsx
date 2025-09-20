import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  // If src already starts with '/', don't add basePath
  const finalSrc = typeof src === 'string' && src.startsWith('/')
    ? src
    : `${basePath || ''}${src}`

  return <NextImage src={finalSrc} {...rest} />
}

export default Image
