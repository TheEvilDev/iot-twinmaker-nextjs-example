const withTM = require("next-transpile-modules")([
    "@awsui/components-react",
    "@awsui/design-tokens",
    "@iot-app-kit/scene-composer",
    "@cloudscape-design/components",
]); // This can be moved to transpilePackages option when nextJS is upgraded to 13.1+

const nextConfig = {
    reactStrictMode: true,
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.hdr$/,
            loader: "url-loader",
        });
        config.module.rules.push({
            test: /\.min$/,
            loader: "next-swc-loader",
        });
        return config;
    },
};

module.exports = withTM(nextConfig);