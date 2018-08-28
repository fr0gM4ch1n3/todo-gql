import { v4 as uuid } from 'uuid';

export class Todo {
    id: string;
    title: string;
    completed: boolean;

    constructor(data: { title?: string, completed?: boolean }) {
        Object.assign(this, {
            id: uuid(),
            title: '',
            completed: false
        }, data);
    }
}
