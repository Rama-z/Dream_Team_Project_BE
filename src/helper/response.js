module.exports = {
  response: (res, result) => {
    const { status, error, data, message, meta } = result;
    const resultPrint = {};
    resultPrint.status = message || "success";
    resultPrint.statusCode = status;
    if (meta) {
      resultPrint.meta = meta;
    }
    resultPrint.data = data || null;
    resultPrint.error = error || null;
    res.status(status).json(resultPrint);
  },
  success: (res, status, result) => {
    const results = {
      status,
      meta: result.meta || null,
      msg: result.msg,
      data: result.data || null,
    };
    res.status(status).json(results);
  },
  error: (res, status, error) => {
    res
      .status(status)
      .json({ status, msg: error.msg, data: error.data || null });
  },
};
