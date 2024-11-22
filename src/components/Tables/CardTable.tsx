const CardTable: React.FC<{data : any}> =  ({data = "No hay Data"}) => {
  return (
    <div className={`rounded-[10px] bg-white px-7.5 pb-4 pt-2 w-[100%] shadow-1 max-w-full dark:bg-gray-dark dark:shadow-card overflow-x-auto`}>
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
      </h4>
      {data}
    </div>
  );
};

export default CardTable;