import { useMemo } from 'react';
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import dynamic from 'next/dynamic';

const SceneViewerComp = dynamic(
    () => import("@iot-app-kit/scene-composer").then((mod) => mod.SceneViewer),
    {
        ssr: false,
        loading: ({ error }) => {
            if (error) {
                return <p>Error {error}</p>;
            }

            return <p>Loading...</p>;
        },
    }
);

const useAwsCredentials = () => {
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
    const sessionToken = process.env.NEXT_PUBLIC_AWS_SESSION_TOKEN;

    const creds = useMemo(() => {
        if (!accessKeyId || !secretAccessKey || !sessionToken) {
            return null;
        } 

        return {
            accessKeyId,
            secretAccessKey,
            sessionToken,
        }

    }, [accessKeyId, secretAccessKey, sessionToken]);

    return creds;
}

const useTwinMakerDataSource = (workspace: string) => {
    const credentials = useAwsCredentials();
    
    const dataSource = useMemo(() => {
        if (credentials) {
            return initialize(workspace, {
                awsCredentials: {
                    ...credentials,

                },
                awsRegion: 'us-east-1',
            });
        }

        return null;
    }, [workspace, credentials]);

    return dataSource;
}

const SceneViewer = ({ workspace, sceneId }: {workspace: string, sceneId: string}) => {
    const dataSource = useTwinMakerDataSource(workspace);
    const sceneLoader = dataSource?.s3SceneLoader(sceneId);

    if (!dataSource || !sceneLoader) {
        return <div>Loading...</div>
    };

    return (
        <SceneViewerComp sceneLoader={sceneLoader} 
                        sceneComposerId='main-composer'
                        sceneMetadataModule={dataSource?.sceneMetadataModule(sceneId)}
                        externalLibraryConfig={{ matterport: { assetBase: '/matterport'  }}} />
    )
}

export default SceneViewer;
