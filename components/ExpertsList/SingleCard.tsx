export interface SingleCardProps {
  title: string
  description: string
  tags: string[]
  website: string
  logo: string
  location: string
  year: string
}

const SingleCard = ({
  title,
  description,
  tags,
  logo,
  location,
  year,
  website,
}: SingleCardProps) => {
  return (
    <div className="justify-start rounded-[8px] border border-[#E4E4E4] p-[15px] text-start text-[#000000] xl:p-[25px]">
      <div className=" flex text-[7px] font-normal md:text-[10px] xl:text-[14px]">
        <img
          src={`${logo}`}
          alt="image"
          className={`h-[70px] w-[70px] rounded-[8px] border  border-[#D9D9D9] md:h-[100px] md:w-[100px]`}
        />
        <div className="ml-auto ">
          <div className="flex">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/gps.svg`}
              alt="image"
              className={`mr-[5px]`}
            />
            <div className="flex items-center">{location}</div>
          </div>
          <div className="mt-[10px] flex">
            <img
              src={`${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                  ? process.env.NEXT_PUBLIC_BASE_PATH
                  : ''
              }/images/building.svg`}
              alt="image"
              className={`mr-[5px]`}
            />
            <div className="flex items-center">{year}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-[15px] text-[10px] font-bold md:mt-[25px] md:text-[12px] lg:text-[14px] lg:!leading-[150%] xl:text-[20px]">
          {title}
        </div>
        <div className="mt-[15px] flex  md:mt-[25px]">
          {tags &&
            tags.map((tag, index) => (
              <div
                className={`${
                  index !== 0 ? 'ml-1' : ''
                } border-b border-[#000000] pb-0 text-[8px] font-normal -tracking-[2%] md:text-[12px] lg:!leading-[19px] xl:text-[16px]`}
                key={index}
              >
                {tag}
                {index !== tags.length - 1 && ', '}
              </div>
            ))}
        </div>
        <div
          title={description}
          className="mt-[15px] h-[60px] overflow-hidden text-[8px] font-normal -tracking-[2%]  text-[#959595] line-clamp-6 md:mt-[25px] md:text-[10px] lg:h-[144px]  lg:text-[12px] lg:!leading-[150%]  xl:text-[16px]"
        >
          {description}
        </div>
      </div>
      <div className="mt-[25px] flex justify-start text-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://calendly.com/`}
          className="cursor-pointer rounded-[5px] border border-[#D5D8DB] bg-[#F5F8FA] px-[21px] py-[12.5px] text-[7px] font-bold text-[#505050] hover:bg-[#d3d5d6] md:text-[10px]  lg:!leading-[19px] xl:text-[12px]"
        >
          Schedule a Call
        </a>
      </div>
    </div>
  )
}

export default SingleCard