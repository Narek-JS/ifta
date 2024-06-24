import Link from "next/link";
import Image from "next/image";
import classNames from 'classnames';
import { dateFormat, ImageLoader } from "@/utils/helpers";
import { RightArrowToGo } from '@/public/assets/svgIcons/RightArrowToGo';
import { CalendarPostIcon } from '@/public/assets/svgIcons/CalendarPostIcon';

export default function PostItem({ data, compact, all }) {

    return (
        <div className={classNames('nth-blog', { compact })}>
            <div className='img'>
                { data.image && (
                    <Image
                        src={data.image}
                        width={368}
                        height={250}
                        blurDataURL={data.image}
                        loader={ImageLoader}
                        alt={data.category_id === 1 ? "Blog" : "News"}
                        loading="lazy"
                    />
                )}
            </div>
            <div className='blog-content'>
                <div className='flexBetween font20 weight500 top-part mb20'>
                    <span className='secondary'>{data.category_id === 1 ? "Blogs" : "News"}</span>
                    {!all && (
                        <Link href="/category/blogs" className='primary60 font20 weight500 underline'>
                            View All
                        </Link>
                    )}
                </div>
                <h3 className='primary font20 weight700 blog-title mb10'>{data.title}</h3>
                <div className='date flex alignCenter gap10'>
                    <CalendarPostIcon />
                    <span className='primary60 font16 weight500'>{dateFormat(data.updated_at)}</span>
                </div>
                {!compact && (
                    <div className="description primary60 mb20 font16" dangerouslySetInnerHTML={{__html: data.body}} />
                )}
                <div>
                    <Link
                        href={`/post/singlePost?slug=${data.slug}&category_id=${data.category_id}`}
                        className='lilac font16 weight700 flex alignCenter gap5 read-more'
                    >
                        {compact ? " Read More" : "Continue Reading"}
                        <RightArrowToGo />
                    </Link>
                </div>
            </div>
        </div>
    );
};