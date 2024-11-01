const CardTable: React.FC<{data : any, width?: string | number}> =  ({data = "No hay Data", width= "100%"}) => {
  return (
    <div className={`rounded-[10px] bg-white px-7.5 pb-4 pt-2 shadow-1 dark:bg-gray-dark dark:shadow-card`}
      style={{ width: width }}>
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
      </h4>
      {data}
    </div>
  );
};

export default CardTable;