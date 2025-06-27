"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronsUpDown, ChevronUp, CircleAlert } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Orders = {
    id: number;
    customer_name: string;
    customer_email: string;
    order_date: Date;
    amount_in_cents: number;
    status: string;
    created_at: Date;
    updated_at: Date;
};

type OrdersTableProps = {
    orders: Orders[];
};

function brazilDateFormatter(date: Date) {
    const data = new Date(date);
    return new Intl.DateTimeFormat("pt-BR").format(data);
}

function brazilMoneyFormatter(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    console.log(searchParams);

    const params = new URLSearchParams(searchParams);

    function handleFilterClick(name: string) {
        if (params.get("sort") === name) {
            params.set("sort", `-${name}`);
        } else if (params.get("sort") === `-${name}`) {
            params.delete("sort");
        } else if (name) {
            params.set("sort", name);
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    function getIconSort(name: string) {
        if (params.get("sort") === name) {
            return <ChevronUp className="w-4" />;
        } else if (params.get("sort") === `-${name}`) {
            return <ChevronDown className="w-4" />;
        }

        return <ChevronsUpDown className="w-4" />;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="w-full">
                    <TableHead className="table-cell">Cliente</TableHead>
                    <TableHead className="table-cell">Status</TableHead>
                    <TableHead
                        className="table-cell cursor-pointer justify-end items-center gap-1"
                        onClick={() => handleFilterClick("order_date")}
                    >
                        <div className="flex items-center gap-1">
                            Data
                            {getIconSort("order_date")}
                        </div>
                    </TableHead>
                    <TableHead
                        className="text-right cursor-pointer flex justify-end items-center gap-1"
                        onClick={() => handleFilterClick("amount_in_cents")}
                    >
                        Valor
                        {getIconSort("amount_in_cents")}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="p-4">
                            <div className="w-full rounded-sm bg-gray-200 p-3 flex items-center gap-2 min-h-[60px]">
                                <span className="text-red-400 flex-shrink-0">
                                    <CircleAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                                </span>
                                <p className="text-xs sm:text-sm text-gray-700">
                                    Que pena, não localizamos nenhum pedido.
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}

                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="hidden md:inline text-sm text-muted-foreground">{order.customer_email}</div>
                        </TableCell>
                        <TableCell>
                            <Badge className={`text-xs`} variant="outline">
                                {order.status === "completed" ? "Completo" : "Pendente"}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{brazilDateFormatter(order.order_date)}</TableCell>
                        <TableCell className="text-right">
                            {brazilMoneyFormatter(order.amount_in_cents / 100)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
