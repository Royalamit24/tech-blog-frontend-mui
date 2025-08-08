import { useState } from "react";

export function UserHomeHook() {

    const [searchTerm, setSearchTerm] = useState('');

    return {
        searchTerm,
        setSearchTerm,
    }
}