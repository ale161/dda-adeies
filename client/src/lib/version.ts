// Utility functions for dynamic version loading from package.json

export interface PackageJson {
  version: string;
  name: string;
  description?: string;
}

// In a Vite environment, we can import package.json directly
// This will be replaced at build time with the actual content
let packageCache: PackageJson | null = null;

export const loadPackageJson = async (): Promise<PackageJson> => {
  if (packageCache) {
    return packageCache;
  }

  try {
    // In Vite, we can import JSON files directly
    const packageModule = await import('../../../package.json');
    packageCache = {
      version: (packageModule.default as any)?.version || '1.0.0',
      name: (packageModule.default as any)?.name || 'adeies-app',
      description: (packageModule.default as any)?.description || 'Greek Leave Application'
    };
    return packageCache;
  } catch (error) {
    console.warn('Could not load package.json, using fallback version:', error);
    // Fallback version in case package.json cannot be loaded
    packageCache = {
      version: '1.0.0',
      name: 'adeies-app',
      description: 'Greek Leave Application'
    };
    return packageCache;
  }
};

export const getCurrentVersion = async (): Promise<string> => {
  try {
    const pkg = await loadPackageJson();
    return pkg.version;
  } catch (error) {
    console.warn('Could not get version from package.json:', error);
    return '1.0.0';
  }
};

export const getAppInfo = async (): Promise<PackageJson> => {
  try {
    return await loadPackageJson();
  } catch (error) {
    console.warn('Could not load app info from package.json:', error);
    return {
      version: '1.0.0',
      name: 'adeies-app',
      description: 'Greek Leave Application'
    };
  }
};