import CSS from 'csstype';

export const theme = {
    container: { 
        textAlign: 'center',
        paddingTop: '30pt'
    } as CSS.Properties,
    input: { 
        fontFamily: 'inherit',
        width: '40%',
        border: '0',
        borderBottom: '2px solid gray',
        outline: '0',
        fontSize: '1.3rem',
        color: 'white',
        padding: '7px 0',
        background: 'transparent',
        transition: 'border-color 0.2s'
    } as CSS.Properties,
    suggestionsContainer: { 
        width: '40%',
        textAlign: 'center',
        margin: 'auto',
        backgroundColor: 'white'
    } as CSS.Properties,
    suggestion: { 
        backgroundColor: 'white',
        border: '1px solid gray'
    } as CSS.Properties,
    suggestionHighlighted: { 
        backgroundColor: 'grey'
    },
}