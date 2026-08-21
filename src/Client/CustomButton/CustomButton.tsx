import styles from "./CustomButton.module.css";

type CustomButtonProps = {
    isLoading: boolean,
    loadingMsg: string,
    finishedLoadingMsg: string
}


export default function CustomButton({isLoading, loadingMsg, finishedLoadingMsg} : CustomButtonProps){
    return (<button
                type="submit"
                className={`${styles.submitButton} ${
                    isLoading ? styles.loading : ""
                }`}
                disabled={isLoading}
                aria-busy={isLoading}>
                {isLoading && (
                    <span className={styles.spinner} aria-hidden="true" />
                )}
                <span>{isLoading ? loadingMsg : finishedLoadingMsg}</span>
            </button>);
}