const FooterText = ({
  text,
  link,
  linkText,
}: {
  text: string
  link: string
  linkText: string
}) => {
  return (
    <p className='font-semibold'>
      {text}{' '}
      <a href={link} className='text-blue-400 hover:underline'>
        {linkText}
      </a>
    </p>
  )
}

export default FooterText
