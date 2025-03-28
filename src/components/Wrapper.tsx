import { FC, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    className?: string;
}

const Wrapper: FC<Props> = ({ children, className }) => {
    return <div className={`container my-4 ${className || ''}`}>{children}</div>;
};

export default Wrapper;
