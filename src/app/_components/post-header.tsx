import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, coverImage, date, author }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
        {title}
      </h1>
      <div className="max-w-6xl mx-auto mb-8 flex gap-6 items-center space-between">
        <div className="">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="">
          <DateFormatter dateString={date} />
        </div>
      </div>
      <div className="mb-4 md:mb-8 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </div>
    </div>
  );
}
