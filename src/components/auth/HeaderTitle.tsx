const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
      <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-transparent'>
        GreenStream
      </h1>
      <h3 className='text-2xl font-bold'>{title}</h3>
    </div>
  )
}

export default HeaderTitle
