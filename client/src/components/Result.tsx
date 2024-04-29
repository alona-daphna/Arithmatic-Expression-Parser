const Result = ({ result }: { result: number }) => {
  return (
    <>
      <h2 className="font-medium my-2">3. Evaluate</h2>
      <div className="font-bold py-1 flex justify-center gap-2 bg-teal-50 rounded-sm">
        Result:<span className=" text-red-700">{result}</span>
      </div>
    </>
  );
};

export default Result;
