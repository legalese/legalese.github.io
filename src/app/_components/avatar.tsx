type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-8 h-8 rounded-full mr-4" alt={name} />
      <div className="text-l font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
