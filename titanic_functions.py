def com_type(row):
    f = row['fam_cnt']
    p = row['psg_count']
    if p==1:
        return "solo"
    elif f==0 and p>1:
        return 'friends'
    else:
        return 'family'


