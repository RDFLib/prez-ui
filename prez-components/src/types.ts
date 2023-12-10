import type { ListItem } from "prez-lib";

export interface ButtonProps {
    color?: "primary" | "secondary";
    size?: "sm" | "lg";
};

export interface ListTableProps {
    items: ListItem[];
    predicates?: {
        label: string;
        uri: string;
    }[];
}

export interface ObjectTableProps {
    properties: {
        predicate: string;
        object: string;
    }[];
}