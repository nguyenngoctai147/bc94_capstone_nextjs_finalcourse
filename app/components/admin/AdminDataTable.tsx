import type { ReactNode } from "react";

export type AdminTableColumn<Row> = {
  key: string;
  label: string;
  className?: string;
  render: (row: Row) => ReactNode;
};

export function AdminDataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
}: {
  caption: string;
  columns: readonly AdminTableColumn<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row) => string | number;
}) {
  return (
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <caption>{caption}</caption>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th className={column.className} scope="col" key={column.key}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={getRowKey(row)}>
                      {columns.map((column) => (
                        <td className={column.className} key={column.key}>
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
