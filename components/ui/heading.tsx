interface HeadingProps {
    title: String;
    description: String;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
    return (
        <div
        className="">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
    );
};

export default Heading;
