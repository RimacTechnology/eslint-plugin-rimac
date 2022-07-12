// NOTE: this is not typed because current types are broken and we can't update them https://github.com/RimacTechnology/eslint-plugin/issues/3
export const sortMembers = (firstElement: any, secondElement: any) => {
    const firstElementName = firstElement.key?.name
    const secondElementName = secondElement.key?.name

    if (firstElementName && secondElementName) {
        return firstElementName < secondElementName ? -1 : 1
    }

    return -1
}

