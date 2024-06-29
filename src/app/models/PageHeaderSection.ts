
import { ButtonFunction } from "./ButtonFunction";
import { AddButtonFunction } from "./AddButtonFunction";
export class PageHeaderSection {
    Title: string;
    AddButton = new AddButtonFunction();
    SaveButton = new ButtonFunction();
    NextButton = new ButtonFunction();
    PreviousButton= new ButtonFunction();
    CustomButton = new Array<ButtonFunction>();
}
