
def header(s,title="")
  bgcolor='ffc'
  titlecolor='aaa'
  color=:black
  puts ""
  puts Paint[" "+title.upcase+ " " * (s.length-title.length + 1),titlecolor,bgcolor]
  puts Paint[" "+s+" ",color,bgcolor,:bright]
  puts Paint[" " * (s.length + 2),color,bgcolor]
  #puts ""
end

def subheader(s,title="")
  bgcolor='fcc'
  titlecolor='bbb'
  color=:black
  puts ""
  puts Paint[" "+title.upcase+ " " * (s.length-title.length + 1),titlecolor,bgcolor]
  puts Paint[" "+s+" ",color,bgcolor]
  #puts Paint[" " * (s.length + 2),color,bgcolor]
  #puts ""
end

def subheader2(s,title="")
  bgcolor='cfc'
  titlecolor='222'
  color=:black
  puts ""

  puts Paint[s,titlecolor,:bright]
  #puts Paint[" " * (s.length + 2),color,bgcolor]
  #puts ""
end

def body(s)
  puts s
end



def red(s)
  puts " "+Paint[s,:red]
end

def bold(s)
  puts " "+Paint[s,:black,:bright]
end

def line(s,color=:black,bgcolor=nil)
  puts " "+Paint[s,color,bgcolor]
end
