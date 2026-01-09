import Container from "@/app/_components/container";
import cn from "classnames";

type Props = {
  preview?: boolean,
  children?: any
};

const Alert = ({ preview, children }: Props) => {
  return children || preview ? (
    <div
      className={cn("border-b", {
        "bg-neutral-800 border-neutral-800 text-white": preview,
        "bg-neutral-50 border-neutral-200": !preview,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          {preview ? (
            <>
              This blog post is <b>NOT</b> published!
            </>
          ) : children}
        </div>
      </Container>
    </div>
  ) : null;
};

export default Alert;
