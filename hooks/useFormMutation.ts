import { useState, useTransition } from 'react';
import Swal from 'sweetalert2';

type FormMutationProps<T> = {
    actions: (formData: FormData) => Promise<any>;
    successMessage?: {
        message: string;
        duration?: number;
    } | null;
    onSuccess?: (result: GeneralAPIResponse & T) => void;
    onError?: (result: GeneralAPIResponse) => void;
};

export function useFormMutation<T>({ actions, successMessage, onSuccess, onError }: FormMutationProps<T>) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<Record<string, string[] | string> | null | undefined>(null);

    const handleFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        setError(null);

        startTransition(async () => {
            const formData = new FormData(e?.currentTarget);

            const result = await actions(formData);

            if (!result?.error) {
                successMessage &&
                    Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: successMessage.duration || 3000,
                        customClass: { container: 'toast' },
                    }).fire({
                        icon: 'success',
                        title: successMessage.message,
                        padding: '10px 20px',
                    });
                onSuccess?.(result);
            } else {
                onError?.(result);

                if (typeof result.error === 'string')
                    Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: { container: 'toast' },
                    }).fire({
                        icon: 'error',
                        title: result.error,
                        padding: '10px 20px',
                    });

                setError(result.error);
            }
        });
    };

    return {
        error,
        setError,
        isPending,
        handleFormSubmit,
    };
}
