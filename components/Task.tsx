import CustomButton from "./ui/customButton";

interface TaskInterface {
    onFinish: (id: number) => void,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
}

const Task = ({ ...props }: TaskType & TaskInterface) => {
    const {
        id,
        title,
        status,
        onFinish,
        onEdit,
        onDelete
    } = props;

    return (
        <div className="flex flex-wrap justify-between gap-5">
            <div className="flex items-baseline gap-5">
                <h1 className="text-xl text-amber-700">{title}</h1>
                <span className="text-sm">({status})</span>
            </div>
            <div className="flex flex-wrap gap-5 bg-gray">
                <CustomButton
                    className="bg-gray-600 border-gray-600 hover:text-gray-600"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </CustomButton>
                <CustomButton
                    className="bg-green-600 border-green-600 hover:text-green-600"
                    onClick={() => onEdit(id)}
                >
                    Edit
                </CustomButton>
                <CustomButton
                    className="bg-red-500 border-red-500 hover:text-red-500"
                    onClick={() => onFinish(id)}
                >
                    Finish
                </CustomButton>
            </div>
        </div>
    )
}

export default Task;