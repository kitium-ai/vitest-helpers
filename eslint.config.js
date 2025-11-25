const moduleExport = await import('@kitiumai/lint/eslint/jest');
const jestConfig = moduleExport.default ?? moduleExport;

export default jestConfig;
