import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { boardService } from "../../services/board.service"
import { loadBoard } from "../../store/board/board.action"
import { UserAvatarIcon } from "../user-avatar-icon"
import { FilterMemberPreview } from "./filter-member-preview"

export function TaskFilterMember() {
    const { board } = useSelector(storeState => storeState.boardModule)
    const [filterBy, setFilterBy] = useState(boardService.getEmpteyFilter())

    // useEffect(() => {
    //     loadBoard(board._id, filterBy)
    // }, [filterBy])

    function onSetMemberFilter(memberId) {
        let updatedMemberIds
        if (filterBy.memberIds.includes(memberId)) {
            updatedMemberIds = filterBy.memberIds.filter(currMemberId => currMemberId !== memberId)
        } else {
            updatedMemberIds = [...filterBy.memberIds, memberId]
        }
        setFilterBy(prev => ({ ...prev, memberIds: updatedMemberIds }))
    }

    return (

        <section className='task-filter-member'>
            <div>
                {board.members.map(member =>
                    <FilterMemberPreview onSetMemberFilter={onSetMemberFilter} member={member}
                        key={member._id} />
                )}
            </div>
        </section>
    )
}
