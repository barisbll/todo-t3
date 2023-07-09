import { Checkbox } from "~/components/shadcn-ui/checkbox";
import { type Reducer, useState, useReducer, useEffect } from "react";
import { cn } from "~/lib/utils";
import { TodoMore } from "./TodoMore";
import { type TodoWithUser } from "./Todo.type";

const initialState = {
  isEditing: false,
  isDeleting: false,
  isCopying: false,
};

export type MoreState = typeof initialState;
export type MoreAction = {
  type: "edit" | "delete" | "copy";
  state: boolean;
};

const moreReducer = (state: MoreState, action: MoreAction) => {
  switch (action.type) {
    case "edit":
      return { ...state, isEditing: action.state };
    case "delete":
      return { ...state, isDeleting: action.state };
    case "copy":
      return { ...state, isCopying: action.state };
    default:
      return state;
  }
};

export const TodoItem = (todoWithUser: TodoWithUser) => {
  const [checked, setChecked] = useState(todoWithUser.done);
  const [moreState, moreStateDispatch] = useReducer<
    Reducer<MoreState, MoreAction>
  >(moreReducer, initialState);

  useEffect(() => {
    const handleCopy = async (text: string) => {
      if ("clipboard" in navigator) {
        return await navigator.clipboard.writeText(text);
      } else {
        return document.execCommand("copy", true, text);
      }
    };

    switch (true) {
      case moreState.isEditing:
        console.log("Editing");
        break;
      case moreState.isDeleting:
        console.log("Deleting");
        break;
      case moreState.isCopying:
        console.log("Copying");
        console.log(todoWithUser);
        void handleCopy(todoWithUser.content).then(() => {
          console.log("Copied");
        });
        moreStateDispatch({ type: "copy", state: false });
        break;
    }
  }, [moreState]);

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="flex w-full items-center justify-between px-6 py-2 md:w-2/3 lg:w-2/3 xl:w-1/2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={todoWithUser.id}
          checked={checked}
          onClick={handleCheckboxChange}
        />
        <label
          htmlFor={todoWithUser.id}
          className={cn({ "line-through": checked, "cursor-pointer": true })}
        >
          {todoWithUser.content}
        </label>
      </div>
      <TodoMore
        todoWithUser={todoWithUser}
        moreState={moreState}
        moreStateDispatch={moreStateDispatch}
      />
    </div>
  );
};
