import { SceneViewer as SceneViewerBase } from '@iot-app-kit/scene-composer';
import { useMemo } from 'react';
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

const useAwsCredentials = () => {
    const creds = useMemo(() => {
        return {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        }
    }, []);

    return creds;
}

const useTwinMakerDataSource = (workspace: string) => {
    const credentials = useAwsCredentials();
    
    const dataSource = useMemo(() => {
        const twinMakerClient = new IoTTwinMakerClient({ credentials });

        return initialize(workspace, {
            iotTwinMakerClient: twinMakerClient
        });
    }, [workspace]);
}

const SceneViewer = () => {
    return (
        <SceneViewerBase sceneLoader={undefined} />
    )
}