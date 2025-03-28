import { WorkflowwNodeDropdwonItemIcon, WorkflowwNodeDropdwonItemIconType } from "@/domain/workflow";
import { CloudUpload, GitFork, Megaphone, NotebookPen } from "lucide-react";

const icons = new Map([
  ["NotebookPen", <NotebookPen size={16} />],
  ["CloudUpload", <CloudUpload size={16} />],
  ["GitFork", <GitFork size={16} />],
  ["Megaphone", <Megaphone size={16} />],
]);

const DropdownMenuItemIcon = ({ type, name }: WorkflowwNodeDropdwonItemIcon) => {
  const getIcon = () => {
    if (type === WorkflowwNodeDropdwonItemIconType.Icon) {
      return icons.get(name);
    } else {
      return <img src={name} className="w-4" />;
    }
  };

  return getIcon();
};

export default DropdownMenuItemIcon;
