import { Pagination } from "antd";

const Paginate = ({
  currentPage,
  pageChangeHandler,
  totalRecord,
  pageSize,
}) => {
  return (
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      hideOnSinglePage
      total={totalRecord}
      onChange={(value) => pageChangeHandler(value)}
    />
  );
};

export default Paginate;
